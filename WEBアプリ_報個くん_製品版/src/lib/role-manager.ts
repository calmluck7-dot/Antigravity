import { adminAuth } from "@/lib/firebase-admin";

/**
 * Sets the 'developer' role for a user, granting System Admin privileges.
 * Usage (call this from an API route or separate script):
 * setDeveloperRole("user-uid-here");
 */
export const setDeveloperRole = async (uid: string) => {
    try {
        const user = await adminAuth.getUser(uid);
        await adminAuth.setCustomUserClaims(uid, {
            role: "developer",
            // Developers might not belong to a specific company, or can allow access to all
        });
        console.log(`Successfully set developer role for user: ${user.email} (${uid})`);
        return true;
    } catch (error) {
        console.error("Error setting developer role:", error);
        return false;
    }
};

/**
 * Sets a company admin role. useful for manual fixes.
 */
export const setCompanyAdminRole = async (uid: string, companyId: string) => {
    try {
        await adminAuth.setCustomUserClaims(uid, {
            role: "admin",
            companyId: companyId
        });
        console.log(`Successfully set admin role for ${uid} in company ${companyId}`);
        return true;
    } catch (error) {
        console.error("Error setting admin role:", error);
        return false;
    }
};
