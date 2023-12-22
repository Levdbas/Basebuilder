import packageJson from '../../package.json' assert { type: 'json' };
import updateNotifier from 'update-notifier';
import chalk from 'chalk';
export async function checkForUpdates() {
   const notifier = updateNotifier({
      pkg: packageJson,
      shouldNotifyInNpmScript: true,
   });

   if (notifier.update !== undefined) {
      notifier.notify({
         message:
            'Update available ' +
            chalk.dim(notifier.update.current) +
            chalk.reset(' → ') +
            chalk.green(notifier.update.latest) +
            ' \nRun ' +
            chalk.cyan('yarn add ') +
            notifier.update.name +
            ' to update',
      });
   }

}
