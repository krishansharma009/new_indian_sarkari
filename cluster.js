// Then modify cluster.js:
const cluster = require("cluster");
const os = require("os");

class ClusterService {
  static async clusterize(dbSync, callback) {
    if (cluster.isPrimary) {
      console.log(`Primary ${process.pid} is running`);

      try {
        // Sync database in primary process
        console.log("Syncing database from primary process...");
        await dbSync();
        console.log("Database sync complete");

        // Fork workers after successful sync
        const numCPUs = os.cpus().length;
        for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
        }

        cluster.on("exit", (worker, code, signal) => {
          if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(`Worker ${worker.process.pid} died. Restarting...`);
            cluster.fork();
          }
        });
      } catch (error) {
        console.error("Fatal: Database sync failed:", error);
        process.exit(1);
      }
    } else {
      // Workers don't sync database, they just start the server
      console.log(`Worker ${process.pid} started`);
      callback();
    }
  }
}

module.exports = ClusterService;
