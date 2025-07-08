const trimStrings = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    } else if (typeof obj[key] === "object") {
      obj[key] = trimStrings(obj[key]);
    }
  }

  return obj;
};

export const trimRequest = (req, res, next) => {
  req.body = trimStrings(req.body);
  req.query = trimStrings(req.query);
  req.params = trimStrings(req.params);
  next();
};
