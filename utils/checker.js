const checkRole = (msg) => {
  if (
    msg.channel.type === 'dm' ||
    !msg.member.roles.cache.find((r) => r.id === '790239605865185320')
  )
    return 'noPerm';
};

module.exports = {
  checkRole,
};
