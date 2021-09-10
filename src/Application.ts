import { CalendarClient } from "./clients/CalendarClient";
import { BrowserUtils } from "./utils/BrowserUtils";

const Application = {
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

Application.main();
