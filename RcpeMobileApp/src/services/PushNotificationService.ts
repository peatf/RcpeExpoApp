import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';

class PushNotificationService {
  private isConfigured = false;

  configure = (onNotification?: (notification: any) => void, onRegister?: (token: { os: string; token: string }) => void) => {
    if (this.isConfigured) {
      console.log("PushNotificationService already configured.");
      return;
    }

    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: (notification) => {
        console.log('NOTIFICATION:', notification);

        // Process the notification here
        // e.g., if (notification.userInteraction) { /* handle tap */ }

        if (onNotification) {
          onNotification(notification);
        }

        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData); // Deprecated for iOS13+, use completionHandler
        if (notification.finish) {
            // For older versions or specific use cases, ensure this is correctly handled.
            // Typically, for remote notifications on iOS, you call the completion handler.
        }
      },

      // (optional) Called when Token is generated (iOS and Android)
      onRegister: (token) => {
        console.log('ON REGISTER TOKEN:', token);
        if (onRegister) {
          onRegister(token);
        }
        // TODO: Send this token to your backend server
      },

      // (optional) Called when Action is pressed (Android)
      onAction: (notification) => {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION WHEN ACTION:', notification);
        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: (err) => {
        console.error('Registration Error:', err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: Platform.OS === 'ios', // Automatically request permissions on iOS at init
    });

    this.isConfigured = true;
    console.log("PushNotificationService configured.");
  };

  // Create a default channel (required for Android >= 8.0)
  createDefaultChannels = () => {
    PushNotification.createChannel(
      {
        channelId: "rcpe-default-channel-id", // (required)
        channelName: "RCPE Default Channel", // (required)
        channelDescription: "A default channel for RCPE app notifications", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel 'rcpe-default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  // Local Notification
  localNotification = (title: string, message: string) => {
    PushNotification.localNotification({
      channelId: "rcpe-default-channel-id", // Must match channelId in createChannel
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      // autoCancel: true, // (optional) default: true
      // bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
      // subText: 'This is a subText', // (optional) default: none
      // largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
      // smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      // vibrate: true, // (optional) default: true
      // vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      // ongoing: false, // (optional) set whether this is an "ongoing" notification
      // priority: "high", // (optional) set notification priority, default: high
      // importance: "high", // (optional) set notification importance, default: high
      // allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    });
  };

  // Request permissions explicitly (especially if requestPermissions: false in configure)
  requestPermissions = () => {
    if (Platform.OS === 'ios') {
        return PushNotification.requestPermissions();
    }
    // For Android, permissions are generally granted by default unless targeting Android 13+ for specific notification permission.
    // react-native-push-notification handles most Android cases automatically if Firebase is set up.
    // For Android 13+ (API 33), you might need to request POST_NOTIFICATIONS permission explicitly.
    // This library might not handle that directly, check its docs for Android 13+.
    console.log("Requesting permissions (primarily for iOS if not auto-requested).");
  }
}

export const pushNotificationService = new PushNotificationService();
