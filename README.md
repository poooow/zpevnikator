# Zpevnikator PWA

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
```

Serve production build over HTTP

```bash
npm run preview
```

## Android

```bash
npm run build
```

```bash
cd android
npx @bubblewrap/cli build
```
Get the APK from the `android/app-release-signed.apk`

On server root .well-known/assetlinks.json must contain SHA256 fingerprint. To get fingerprint run `keytool -printcert -jarfile android/app-release-signed.apk | grep SHA256`