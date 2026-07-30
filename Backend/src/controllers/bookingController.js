const getBookings = (req, res) => {
  res.json({
    message: 'Sample bookings endpoint',
    bookings: [
      { id: 1, guestName: 'Ada', roomType: 'Deluxe' },
      { id: 2, guestName: 'Grace', roomType: 'Suite' }
    ]
  });
};

module.exports = {
  getBookings
};
