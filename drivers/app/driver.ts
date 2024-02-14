import Homey from 'homey';
import axios from 'axios';
import { PairSession } from 'homey/lib/Driver';

class AppDriver extends Homey.Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('AppDriver has been initialized');

    const cardActionSendMessage = this.homey.flow.getActionCard('send-message');
    cardActionSendMessage.registerRunListener(async(args) => {
        const { title } = args;
        const { message } = args;
        const { priority } = args;
        const { device } = args;

        const bodyFormData = {
          title: title,
          message: message,
          priority: priority,
        };
        axios({
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          url: await device.getServerUrl() + "/message?token=" + await device.getToken(),
          data: bodyFormData,
        })
          .then(function (response: any) { console.log(response.data);})
          .catch(function (error: any) {console.error(error);});
      })
  }

  async onPair(session: PairSession) {
    // Show a specific view by ID
    await session.showView("app_settings");

    // Show the next view
    await session.nextView();

    // Show the previous view
    await session.prevView();

    // Close the pair session
    await session.done();

    // Received when a view has changed
    session.setHandler("showView", async function (viewId) {
      console.log("View: " + viewId);
    });
  }
}

module.exports = AppDriver;
