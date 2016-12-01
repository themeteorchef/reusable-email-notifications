import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import templateToHTML from './template-to-html.js';

const sendEmail = (template, { to, from, replyTo, subject, attachments }, payload) => {
  const email = {
    to,
    from: from || 'ShipShape <notifications@shipshape.fm>',
    replyTo,
    subject,
    html: templateToHTML(template, payload),
  };

  if (attachments) email.attachments = attachments;
  Meteor.defer(() => { Email.send(email); });
};

const notifications = {
  shipmentHasMoved({ to, shipmentId }) {
    sendEmail('standard', {
      to,
      replyTo: 'notifications@shipshape.fm',
      subject: '[ShipShape] Your Package is on the Move!',
    }, {
      title: 'Your package has moved!',
      subtitle: 'ShipShape detected a change on your package\'s location.',
      body: templateToHTML('shipment-moved', { shipmentId }),
      callToAction: {
        url: `https://shipshape.fm/shipments/${shipmentId}`,
        label: 'View Shipment Details',
      },
    });
  },
  shipmentIsDelayed({ to, shipmentId }) {
    sendEmail('standard', {
      to,
      replyTo: 'notifications@shipshape.fm',
      subject: '[ShipShape] Your Package is Delayed :(',
    }, {
      title: 'Your package is delayed :(',
      subtitle: 'ShipShape detected a delay on your package\'s delivery.',
      body: templateToHTML('shipment-delayed', { shipmentId }),
      callToAction: {
        url: `https://shipshape.fm/shipments/${shipmentId}`,
        label: 'View Shipment Details',
      },
    });
  },
  shipmentWasDelivered({ to, shipmentId }) {
    sendEmail('standard', {
      to,
      replyTo: 'notifications@shipshape.fm',
      subject: '[ShipShape] Your Package Was Delivered!',
    }, {
      title: 'Your package was delivered!',
      subtitle: 'ShipShape detected a succesful delivery of your package.',
      body: templateToHTML('shipment-delivered', { shipmentId }),
      callToAction: {
        url: `https://shipshape.fm/shipments/${shipmentId}`,
        label: 'View Shipment Details',
      },
    });
  },
};

export default function (type, payload) {
  notifications[type](payload);
}
