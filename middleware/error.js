const errorHandler = (err, req, res, next) => {
    if (err.status) {
      res.status(err.status).json({success:err.success, message: err.message });
    } else {
      res.status(500).json({ success:err.success, message: err.message });
    }
  };
  export default errorHandler;
  