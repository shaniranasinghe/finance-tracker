import SystemSettings from "../model/systemSettingsModel.js";

// Add or update system settings (Admin only)
export const configureSystemSettings = async (req, res) => {
  try {
    const { categories, limits } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }

    if (categories) settings.categories = categories;
    if (limits) settings.limits = limits;

    await settings.save();

    res.status(200).json({ message: "System settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ error: "Failed to configure system settings", details: error.message });
  }
};

// Retrieve system settings
export const getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne();

    if (!settings) {
      return res.status(404).json({ error: "System settings not found" });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve system settings", details: error.message });
  }
};
