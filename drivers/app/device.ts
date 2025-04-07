import Axios, { AxiosInstance } from 'axios';
import Homey from 'homey';
import https from 'https';

class AppDevice extends Homey.Device {

  settings: any;
  axiosInstance: AxiosInstance =  Axios.create({
                                    httpsAgent: new https.Agent({  
                                        rejectUnauthorized: false
                                    })
                                  });

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.settings = this.getSettings();
    
    this.log(this.settings.name + ' has been initialized');
    
    let device_urlNotValid: boolean = false;
    let device_unavailable: boolean = false;

    let availability_interval = setInterval(async () => {
      try{
        let url = await new URL(await this.getServerUrl());
        device_urlNotValid = false;
        await this.setAvailable();
      }
      catch(error){
        if(!device_urlNotValid){
          device_urlNotValid = true;
          await this.setUnavailable(this.homey.__('device_url') + await this.getServerUrl() + this.homey.__('device_notValid'));
        }
      }
      if(!device_urlNotValid){
        let promise = await this.axiosInstance({
                              method: "get",
                              url: await this.getServerUrl(),
                              data: "",
                              timeout: 5 * 1000,
                          })
                          .then((response) => {
                              if(response.status == 200){
                                device_unavailable = false;
                              }
                              else{
                                device_unavailable = true;
                              };
                          })
                          .catch((error) => {
                              //console.error({ error });
                              device_unavailable = true;
                          });
        if(device_unavailable){
          await this.setUnavailable(this.homey.__('device_unavailable'));
        }
        else {
          await this.setAvailable();
        }
      }
    }, 5 * 1000);
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log(this.getSettings().name + ' has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings: {}, newSettings: {}, changedKeys: [] }): Promise<string|void> {
    this.log(this.getSettings().name + ' settings were changed');
    this.settings = this.getSettings();
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name: string) {
    this.log(this.getSettings().name + ' was renamed');
    this.settings = this.getSettings();
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log(this.getSettings().name + ' has been deleted');
    this.settings = this.getSettings();
  }

  async getServerUrl(){
    return this.getSettings().url;
  }

  async getToken(){
    return this.getSettings().token;
  }
}

module.exports = AppDevice;
