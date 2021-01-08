const checkRole = (msg) => {
  if (!msg.member.roles.cache.find((r) => r.id === '797024961738178590'))
    return;
};

module.exports = {
  checkRole,
};
