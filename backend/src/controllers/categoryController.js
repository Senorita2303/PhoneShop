const { StatusCodes } = require('http-status-codes')
const services = require("~/services");

// Create Category admin route 
export const createCategory = async (req, res) => {
    try {
        const fileData = req.file;
        const response = await services.createCategory(req.body, fileData);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all category admin route
export const getAllCategories = async (req, res) => {
    try {
        const response = await services.getAllCategories();
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};


// Update admin route 
export const updateCategory = async (req, res) => {
    try {
        const fileData = req.file;
        const response = await services.updateCategory(req, fileData);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};


// Delete category - admin  
export const deleteCategory = async (req, res) => {
    try {
        const response = await services.deleteCategory(req.params.id);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Detils of category 
export const getCategoryDetails = async (req, res) => {
    try {
        const response = await services.getCategoryDetails(req.params.id);
        return res.status(StatusCodes.OK).json(response);

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};
