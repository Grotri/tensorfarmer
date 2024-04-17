import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json' assert { type: 'json' }

const isDev = process.env.NODE_ENV == 'development'

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  options_page: 'options.html',
  devtools_page: 'devtools.html',
  background: {
    service_worker: 'src/background/index.js',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://*.tensor.trade/trade/*'],
      js: ['src/contentScript/index.js'],
      "run_at": "document_end"
    },
  ],
  host_permissions: [
    "https://*.tensor.trade/trade/*"
  ],
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', "src/script.js", 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: ['https://*.tensor.trade/*'],
    },
  ],
  externally_connectable: {
    ids: [
      "*"
    ],
    // If this field is not specified, no web pages can connect.
    matches: [
      "https://*.tensor.trade/*"
    ],
    accepts_tls_channel_id: false
  },
  permissions: ['sidePanel', 'storage', "tabs", "activeTab", "scripting", "webNavigation", "management", "nativeMessaging"],
})
