import { createRequire } from "module";
const packageJson = createRequire(import.meta.url)("../../package.json");
import updateNotifier from 'update-notifier';
import chalk from 'chalk';

// Assign chalk to global if not already set
if (!globalThis.chalk) {
   globalThis.chalk = chalk;
}

export async function checkForUpdates() {
   const notifier = updateNotifier({
      pkg: packageJson,
      shouldNotifyInNpmScript: true,
      updateCheckInterval: 1000
   });

   if (notifier.update !== undefined) {
      notifier.notify({
         message:
            'Update available ' +
            globalThis.chalk.dim(notifier.update.current) +
            globalThis.chalk.reset(' → ') +
            globalThis.chalk.green(notifier.update.latest) +
            ' \nRun ' +
            globalThis.chalk.cyan('yarn add ') +
            notifier.update.name +
            ' to update',
      });
   }
}