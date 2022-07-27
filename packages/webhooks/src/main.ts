import { provision } from './provision.js'

provision()

// No need to catch anything, for these reasons:
//
// 1. I registered some Hapi plugins to catch any unhandled exceptions:
//    Error Reporting: sends error reports to Error Reporting
//    Telegram: sends messages to a Telegram chat
// 2. I use the Hapi Exiting plugin to try to perform a graceful shutdown.
// 3. This application runs in a container in a managed platform (Cloud Run), so
//    we let it crash and let Google cleanup the process. We might not even have
//    the time to perform a graceful shutdown, because it depends on Google.
//
// See also:
// https://github.com/ahmetb/cloud-run-faq#what-is-the-termination-signal-for-cloud-run-services
