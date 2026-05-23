export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if(err.name === "CastError" && err.kind === "ObjectId"){
        statusCode = 400
        message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
    }
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `An account with this ${field} already exists.`;
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV == "development" ? err.stack : undefined
    })

}