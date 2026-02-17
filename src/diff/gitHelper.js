const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Helper to handle Git operations for the diff command
 */
class GitHelper {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
    }

    /**
     * Checks if a string is a valid git reference (branch, commit, tag)
     */
    isValidRef(ref) {
        try {
            execSync(`git rev-parse --verify "${ref}"`, {
                cwd: this.projectRoot,
                stdio: 'ignore'
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Exports a git reference to a temporary directory
     * Returns the path to the temporary directory
     */
    exportRefToTemp(ref) {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cognitive-debt-diff-'));

        try {
            // efficient way to export: git archive | tar -x
            // explicitly using format=tar to pipe to tar command
            const archiveCmd = `git archive --format=tar "${ref}"`;
            const extractCmd = `tar -x -C "${tempDir}"`;

            execSync(`${archiveCmd} | ${extractCmd}`, {
                cwd: this.projectRoot,
                stdio: 'pipe'
            });

            return tempDir;
        } catch (error) {
            // Clean up if failed
            try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) { }
            throw new Error(`Failed to export git ref "${ref}": ${error.message}`);
        }
    }

    /**
     * Cleans up a temporary directory
     */
    cleanup(tempPath) {
        if (tempPath && fs.existsSync(tempPath)) {
            try {
                fs.rmSync(tempPath, { recursive: true, force: true });
            } catch (e) {
                console.error(`Warning: Failed to clean up temp dir ${tempPath}`);
            }
        }
    }
}

module.exports = GitHelper;
