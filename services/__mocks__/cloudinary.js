module.exports = {
  v2: {
    config: () => {},
    uploader: {
      upload: (a, b, cb) => {
        cb(null, { public_id: "1234", secure_url: "secure_url" });
      },
    },
  },
};
