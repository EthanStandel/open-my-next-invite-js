import { CalendarClient } from "./clients/CalendarClient";
import { BrowserUtils } from "./utils/BrowserUtils";
import { LoggingUtils } from "./utils/LoggingUtils";

const Application = {
  async bootstrap(): Promise<void> {
    LoggingUtils.replaceLoggersWithDatestampPrepender();
  },

  async main(): Promise<void> {
    const meeting = await CalendarClient.getNextMeetingData();

    const videoCall = meeting.conferenceData?.entryPoints?.find(
      ({ entryPointType }) => entryPointType === "video"
    );

    if (videoCall?.uri) {
      console.log(`Opening up video call for "${meeting.summary}"`);
      BrowserUtils.open(videoCall.uri);
    } else {
      console.error(`No video call found for "${meeting.summary}"`);
    }

    console.log("Process complete.");
    process.exit(); // needed due to exec'd browser tabs
  },
};

Application.bootstrap().then(() => Application.main());
