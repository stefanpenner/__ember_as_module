
module.exports = function parseModuleName(name) {
  var parsed = name.match(/(@?[^@]+)@?(.+)?/)

  return {
    name: parsed[1],
    version: parsed[2] || null
  };
};
