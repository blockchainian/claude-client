"""Exercise the installed pre-commit hook against real staged Git changes."""

import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


class PrivacyHookTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.env = dict(os.environ)
        self.env.pop("PRIVACY_DENYLIST", None)
        for relative in [
            ".githooks/pre-commit",
            ".gitleaks.toml",
            ".github/scripts/gitleaks-privacy.py",
        ]:
            target = self.root / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / relative, target)
            target.chmod((ROOT / relative).stat().st_mode)
        self.git("init")
        self.git("config", "user.name", "Example User")
        self.git("config", "user.email", "user@example.com")
        self.git("config", "core.hooksPath", ".githooks")

    def git(self, *args, check=True):
        return subprocess.run(
            ["git", *args], cwd=self.root, env=self.env, text=True,
            capture_output=True, check=check,
        )

    def commit(self, content):
        (self.root / "example.txt").write_text(content, encoding="utf-8")
        self.git("add", "--", "example.txt")
        return self.git("commit", "-m", "Check staged privacy", check=False)

    def assert_no_commit(self):
        self.assertNotEqual(self.git("rev-parse", "--verify", "HEAD", check=False).returncode, 0)

    def test_api_key_blocks_commit(self):
        self.env["PRIVACY_DENYLIST"] = "private-account"
        key = "ghp_" + "A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8"
        result = self.commit("API_KEY=" + key + "\n")
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn(key, result.stdout + result.stderr)
        self.assert_no_commit()

    def test_lockfile_is_excluded_from_private_terms(self):
        self.env["PRIVACY_DENYLIST"] = "abcd"
        (self.root / "package-lock.json").write_text(
            '{"integrity":"sha512-abcd"}\n', encoding="utf-8"
        )
        self.git("add", "--", "package-lock.json")
        result = self.commit("A clean staged line.\n")
        self.assertEqual(result.returncode, 0, result.stderr)
        revision = self.git("rev-parse", "HEAD").stdout.strip()
        result = subprocess.run(
            ["python3", ".github/scripts/gitleaks-privacy.py", "git",
             "--log-opts=--diff-merges=first-parent " + revision],
            cwd=self.root, env=self.env, text=True, capture_output=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        result = self.commit("abcd\n")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("example.txt:1", result.stdout + result.stderr)

    def test_missing_denylist_blocks_commit(self):
        result = self.commit("A clean staged line.\n")
        self.assertNotEqual(result.returncode, 0)
        self.assert_no_commit()

    def test_blank_denylist_blocks_commit(self):
        self.env["PRIVACY_DENYLIST"] = " \n"
        (self.root / ".env").write_text("PRIVACY_DENYLIST='private-account'\n", encoding="utf-8")
        result = self.commit("A clean staged line.\n")
        self.assertNotEqual(result.returncode, 0)
        self.assert_no_commit()

    def test_configured_denylist_blocks_encoded_private_paths(self):
        self.env["PRIVACY_DENYLIST"] = "private-account"
        result = self.commit("-Users-private-account-project\n")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("example.txt:1", result.stdout + result.stderr)
        self.assertNotIn("private-account", result.stdout + result.stderr)
        self.assert_no_commit()

    def test_local_denylist_allows_clean_commit(self):
        (self.root / ".env").write_text(
            "PRIVACY_DENYLIST='private-account\nprivate-project'\n", encoding="utf-8"
        )
        result = self.commit("A clean staged line.\n")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.git("rev-parse", "--verify", "HEAD").returncode, 0)

    def test_dotenv_denylist_blocks_encoded_private_paths(self):
        (self.root / ".env").write_text(
            "OTHER=public\nPRIVACY_DENYLIST='private-project\nprivate-account'\n",
            encoding="utf-8",
        )
        result = self.commit("-Users-private-account-project\n")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("example.txt:1", result.stdout + result.stderr)
        self.assertNotIn("private-account", result.stdout + result.stderr)
        self.assert_no_commit()

    def test_empty_dotenv_denylist_blocks_commit(self):
        (self.root / ".env").write_text("PRIVACY_DENYLIST=''\nOTHER=public\n", encoding="utf-8")
        result = self.commit("A clean staged line.\n")
        self.assertNotEqual(result.returncode, 0)
        self.assert_no_commit()

    def test_malformed_dotenv_blocks_commit(self):
        (self.root / ".env").write_text("PRIVACY_DENYLIST='private-account\n", encoding="utf-8")
        result = self.commit("A clean staged line.\n")
        self.assertNotEqual(result.returncode, 0)
        self.assert_no_commit()


if __name__ == "__main__":
    unittest.main()
