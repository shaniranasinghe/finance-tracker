export const fetch = async (req, res) => {
    try {
        return res.json("Hello World");
    }catch (error) {
        res.status(500).json({error: "Internal Server error"});
        
    }
}