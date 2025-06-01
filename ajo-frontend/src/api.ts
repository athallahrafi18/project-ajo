export const fetchMenus = async () => {
  try {
    const response = await fetch('https://project-ajo-production.up.railway.app/api/menus');
    if (!response.ok) {
      throw new Error('Failed to fetch menus');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching menus:', error);
    return [];
  }
};