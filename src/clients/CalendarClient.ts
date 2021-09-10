import { OauthClient } from "./OauthClient";

import type { calendar_v3 } from "googleapis";
import { google } from "googleapis";

export const CalendarClient = {
  async getNextMeetingData(): Promise<calendar_v3.Schema$Event> {
    const calendar = google.calendar({
      version: "v3",
      auth: await OauthClient.create(),
    });
    return new Promise((resolve, reject) => {
      calendar.events.list(
        {
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          maxResults: 1,
          singleEvents: true,
          orderBy: "startTime",
        },
        (error, res) => {
          const meetingData = res?.data.items?.[0];
          if (error || !meetingData) {
            console.error("Failed to fetch calendar data.", error);
            reject(error);
          } else {
            resolve(meetingData);
          }
        }
      );
    });
  },
};
