import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import rateLimit from '../../modules/rate-limit.js';
import sendEmailNotification from '../../modules/server/send-email-notification.js';

const sendShipmentNotifcation = new ValidatedMethod({
  name: 'shipments.sendNotification',
  validate: new SimpleSchema({
    type: { type: String },
    payload: { type: Object, blackbox: true },
  }).validator(),
  run({ type, payload }) {
    sendEmailNotification(type, payload);
  },
});

rateLimit({
  methods: [
    sendShipmentNotifcation,
  ],
  limit: 5,
  timeRange: 1000,
});
