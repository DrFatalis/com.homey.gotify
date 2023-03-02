import Homey from 'homey';

class GotifyClient extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('GotifyClient has started');
  }
}

module.exports = GotifyClient;
