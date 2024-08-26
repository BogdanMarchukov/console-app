import axios from "axios";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Actions, Arguments } from "./types";

const argv = yargs(hideBin(process.argv))
  .option("login", {
    alias: "l",
    type: "string",
    demandOption: true,
    description: "Login for authentication",
  })
  .option("password", {
    alias: "p",
    type: "string",
    demandOption: true,
    description: "Password for authentication",
  })
  .option("action", {
    alias: "a",
    type: "string",
    demandOption: true,
    description: `${Actions.SIGN_UP}, ${Actions.SIGN_IN}, ${Actions.UPDATE_CAR}, ${Actions.DELETE_CAR}, ${Actions.UPDATE_CAR}`,
  })
  .option("args", {
    alias: "r",
    type: "array",
    description: "Arguments for the action",
  }).argv as Arguments;

async function main() {
  const { login, password, action, args } = argv;

  try {
    if (action === Actions.SIGN_UP) {
      const result = await axios.post("http://localhost:3000/auth/sing-up", {
        username: login,
        password,
      });
      console.log(result.data);
      return;
    }

    const authResponse = await axios.post(
      "http://localhost:3000/auth/sing-in",
      {
        username: login,
        password: password,
      },
    );

    const token = authResponse.data.jwt;
    console.log(token);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    let response;

    switch (action) {
      case Actions.GET_CAR:
        let query = `brand=${args[0]}`;
        if (args[1]) {
          query += `&sortBy=${args[1]}`;
        }
        if (args[2]) {
          query += `&sort=${args[1]}`;
        }
        response = await axios.get(`http://localhost:3000/car/get?${query}`, {
          headers,
        });
        console.log("Car data:", response.data);
        break;

      case Actions.CREATE_CAR:
        response = await axios.post(
          "http://localhost:3000/car/create",
          {
            brand: args[0].toString(),
            model: args[1].toString(),
            productionYear: +args[2],
            price: +args[3],
          },
          { headers },
        );
        console.log("Created car:", response.data);
        break;

      case Actions.UPDATE_CAR:
        const body = {
          carId: args[0].toString(),
        } as any;
        if (args[1]) {
          body["model"] = args[1].toString();
        }
        if (args[2]) {
          body["productionYear"] = args[2];
        }
        if (args[3]) {
          body["price"] = args[3];
        }
        response = await axios.put("http://localhost:3000/car/update", body, {
          headers,
        });
        console.log("Updated car:", response.data);
        break;
      case Actions.DELETE_CAR:
        response = await axios.delete(
          `http://localhost:3000/car/delete?carId=${args[0]}`,
          {
            headers,
          },
        );
        console.log("Delete car:", response.data);
        break;
      default:
        console.log("Unknown action:", action);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
