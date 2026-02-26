const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'grafrafraftorres28@gmail.com',
    pass: process.env.EMAIL_PASS || 'cssv jcji bckp tgqw'
  }
});

// Send email helper function
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Streamrock Realty" <${process.env.EMAIL_USER || 'grafrafraftorres28@gmail.com'}>`,
      to,
      subject,
      html
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// @route   GET /api/bookings
// @desc    Get all bookings (admin only)
// @access  Private
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, isRead } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const bookings = await Booking.find(filter)
      .populate('project', 'name slug')
      .populate('respondedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/stats
// @desc    Get booking statistics
// @access  Private
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const unreadCount = await Booking.countDocuments({ isRead: false });
    const totalCount = await Booking.countDocuments();

    const result = {
      total: totalCount,
      unread: unreadCount,
      pending: 0,
      approved: 0,
      rejected: 0,
      completed: 0,
      cancelled: 0
    };

    stats.forEach(s => {
      result[s._id.toLowerCase()] = s.count;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/unread-count
// @desc    Get unread booking count for badge
// @access  Private
router.get('/unread-count', protect, adminOnly, async (req, res) => {
  try {
    const count = await Booking.countDocuments({ isRead: false, status: 'Pending' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('project', 'name slug cardImage')
      .populate('respondedBy', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Mark as read
    if (!booking.isRead) {
      booking.isRead = true;
      await booking.save();
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking (public)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, project, projectName, preferredDate, preferredTime, message } = req.body;

    const booking = new Booking({
      name,
      email,
      phone,
      project,
      projectName,
      preferredDate,
      preferredTime,
      message
    });

    await booking.save();

    // Send confirmation email to customer
    const customerEmailHtml = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a365d; margin: 0;">Streamrock Realty</h1>
        </div>
        <div style="background: #f7fafc; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #1a365d; margin-top: 0;">Booking Confirmation</h2>
          <p style="color: #4a5568;">Dear ${name},</p>
          <p style="color: #4a5568;">Thank you for scheduling a property viewing with Streamrock Realty. We have received your booking request and will contact you shortly to confirm your appointment.</p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1a365d; margin-top: 0;">Booking Details</h3>
            <p style="margin: 8px 0;"><strong>Property:</strong> ${projectName || 'General Inquiry'}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date(preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${preferredTime}</p>
          </div>
          <p style="color: #4a5568;">If you need to reschedule or have any questions, please contact us at:</p>
          <p style="color: #4a5568;">📞 +63 908 885 6169</p>
          <p style="color: #4a5568;">📧 dwllaneta@gmail.com</p>
        </div>
        <p style="color: #718096; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Streamrock Realty Corporation. All rights reserved.
        </p>
      </div>
    `;

    await sendEmail(email, 'Booking Confirmation - Streamrock Realty', customerEmailHtml);

    // Send notification email to admin
    const adminEmailHtml = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1a365d; color: white; padding: 20px; border-radius: 12px 12px 0 0;">
          <h2 style="margin: 0;">New Booking Request</h2>
        </div>
        <div style="background: #f7fafc; padding: 30px; border-radius: 0 0 12px 12px;">
          <h3 style="color: #1a365d; margin-top: 0;">Customer Information</h3>
          <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone}</p>
          <h3 style="color: #1a365d; margin-top: 20px;">Booking Details</h3>
          <p style="margin: 8px 0;"><strong>Property:</strong> ${projectName || 'General Inquiry'}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date(preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${preferredTime}</p>
          ${message ? `<p style="margin: 8px 0;"><strong>Message:</strong> ${message}</p>` : ''}
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/bookings" style="background: #1a365d; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">View in Dashboard</a>
          </div>
        </div>
      </div>
    `;

    await sendEmail('dwllaneta@gmail.com', `New Booking: ${name} - ${projectName || 'General Inquiry'}`, adminEmailHtml);

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('newBooking', {
        _id: booking._id,
        name: booking.name,
        projectName: booking.projectName,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime,
        createdAt: booking.createdAt
      });
    }

    res.status(201).json({ 
      message: 'Booking created successfully. We will contact you shortly.',
      booking 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (approve/reject)
// @access  Private
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    booking.adminNotes = adminNotes;
    booking.respondedAt = new Date();
    booking.respondedBy = req.admin._id;

    await booking.save();

    // Send email notification to customer
    let statusMessage = '';
    let statusColor = '';

    switch (status) {
      case 'Approved':
        statusMessage = 'Your booking has been approved! We look forward to seeing you.';
        statusColor = '#22c55e';
        break;
      case 'Rejected':
        statusMessage = 'Unfortunately, we are unable to accommodate your booking request at this time.';
        statusColor = '#ef4444';
        break;
      case 'Completed':
        statusMessage = 'Thank you for visiting! We hope you enjoyed your property viewing.';
        statusColor = '#3b82f6';
        break;
      default:
        statusMessage = `Your booking status has been updated to: ${status}`;
        statusColor = '#6b7280';
    }

    const statusEmailHtml = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a365d; margin: 0;">Streamrock Realty</h1>
        </div>
        <div style="background: #f7fafc; border-radius: 12px; padding: 30px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="background: ${statusColor}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold;">
              ${status.toUpperCase()}
            </span>
          </div>
          <h2 style="color: #1a365d; text-align: center;">Booking Update</h2>
          <p style="color: #4a5568;">Dear ${booking.name},</p>
          <p style="color: #4a5568;">${statusMessage}</p>
          ${adminNotes ? `<div style="background: white; border-left: 4px solid #1a365d; padding: 15px; margin: 20px 0;"><strong>Note from our team:</strong><br/>${adminNotes}</div>` : ''}
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1a365d; margin-top: 0;">Your Booking Details</h3>
            <p style="margin: 8px 0;"><strong>Property:</strong> ${booking.projectName || 'General Inquiry'}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${booking.preferredTime}</p>
          </div>
          <p style="color: #4a5568;">If you have any questions, please contact us at:</p>
          <p style="color: #4a5568;">📞 +63 908 885 6169</p>
          <p style="color: #4a5568;">📧 dwllaneta@gmail.com</p>
        </div>
        <p style="color: #718096; font-size: 12px; text-align: center; margin-top: 20px;">
          © ${new Date().getFullYear()} Streamrock Realty Corporation. All rights reserved.
        </p>
      </div>
    `;

    await sendEmail(booking.email, `Booking ${status} - Streamrock Realty`, statusEmailHtml);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('bookingUpdated', {
        _id: booking._id,
        status: booking.status
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Private
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/mark-read
// @desc    Mark multiple bookings as read
// @access  Private
router.put('/mark-read', protect, adminOnly, async (req, res) => {
  try {
    const { ids } = req.body;
    
    await Booking.updateMany(
      { _id: { $in: ids } },
      { $set: { isRead: true } }
    );

    res.json({ message: 'Bookings marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
