module.exports = function parseModuleName(name) {
  if (typeof name !== 'string') {
    throw new TypeERror('parseModuleName requires string input');
  }
  var parsed = name.match(/(@?[^@]+)@?(.+)?/);

  return {
    name: parsed[1],
    version: parsed[2] || null
  };
};
