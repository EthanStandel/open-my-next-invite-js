# open-my-next-invite-js

## Origin

[Logitech's Logi Dock](https://www.logitech.com/en-us/products/personal-workspaces/logi-dock.html) caught my eye recently. It seemed like it could be a really cool addition to a home office, but as I started to compare the price for what it offered it just didn't add up. It's a conference speaker, USB C dock, and macro-keyboard with some cool integrated software for managing meetings.

The thing is that I already have speakers, a USB C dock, and a [macro-keyboard](https://www.pikatea.com/collections/products/products/pikatea-leon-macropad-5x1-kit) (which has been gathering a lot of dust). The only thing I was really missing was their magic "go to meeting" button. And so I wrote "open-my-next-invite-js" 🤷‍♂️ For the other buttons available on the Logi Dock, they were pretty simple macro-bindings (for Zoom mic-toggle is just Shift+Cmd+A and vid-toggle is just Shift+Cmd+V).

## Why -js?

I want to rewrite this in something a little bit more native when I'm not working on a dozen other personal and professional projects. For me, right now, Node is just the easiest thing to get up and running quickly and simply.

## Who is this for?

Generally I built it for my own workflow.

- MacOS
- Google Calendar
- Zoom meetings

It should sort-of work in some other workflows but there are definitely some caveats. For instance, if your meetings were Google Meet, it should still work _unless_ your Google Meet user is not the same as your Chrome user. In that case it'll open up the meeting but then you'll need to switch users. I also rely on the very nifty `open` command on MacOS for opening arbitrary links in a new tab of your default browser. For other systems I just tell you "hey please open this URL in your browser" which is not ideal. And then if you don't use Google Calendar you're SOL on support currently. You could try to share your calendar to a Gmail user but even that might require some modifications.

If you want some modifications for your workflow open an issue and we can try to work together on it 🙂

## Build process

All you need is NPM really.

1. `npm i`
1. A lot of setup BS through Google Cloud Platform, see below
1. `npm run build:start` 

So easy, right? But seriously for GCP, vaguely what you need to do is...

1. Go to [GCP](https://console.cloud.google.com/)
1. Create a new project
1. Go to "APIs & Services" > "Library"
1. Add the "Google Calendar API"
1. Go to "APIs & Services" > "Credentials"
1. Hit "+ CREATE CREDENTIALS" > "Help me choose"
1. Choose the "Google Calendar API" and "User data"
1. Add the scopes ".../auth/calendar.readonly" and ".../auth/calendar.events.readonly"
1. Choose "Desktop app"
1. Save the credentials file in this repo as `src/environment/google-calendar.api-credentials.json`
1. And then go _back_ to GCP
1. Go to "APIs & Services" > "OAuth consent screen"
1. Hit "MAKE EXTERNAL"
1. And just declare the app as in testing and declare the users who you intend to log into this as

Simple, right? 🙃

## Deploy process

As for how I deployed this to a key on my [macro-board](https://www.pikatea.com/collections/products/products/pikatea-leon-macropad-5x1-kit), that's a few more steps that will be some what specific to your system and available tools.

In my case, I used [this article](https://dev.to/adamlombard/macos-run-a-script-in-any-app-via-custom-hotkey-4n99) to bind the script to a _very obnoxious_ hotkey. I reccomend keeping the hotkey as obnoxious as possible so that you don't risk overwriting something you might actually want to use. I then bound that hotkey on my macro-board using it's default software, [Vial](https://get.vial.today/) (basically just a GUI QMK bundler).

If you want an easily bindable traditional keyboard I can heavily recommend Drop's Alt or Ctrl keyboards which have a very simple [web-based configurator](https://drop.com/mechanical-keyboards/configurator).