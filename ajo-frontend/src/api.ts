export const fetchMenus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/menus');
      if (!response.ok) {
        throw new Error('Failed to fetch menus');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching menus:', error);
      return [];
    }
  };
  