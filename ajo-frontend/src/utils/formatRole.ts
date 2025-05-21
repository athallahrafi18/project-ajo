export const getRoleName = (role_id: number): string => {
    const roleNames: {[key: number]: string} = {
        1: "admin",
        2: "cashier",
        3: "manager",
        4: "owner",
    };
    return roleNames[role_id] || "unknown";
};