const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const dbpath = path.join(__dirname, "todoApplication.db");
let db = null;
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(30000, () => {
      console.log("Server is running at 3000");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
    process.exit(1);
  }
};
initializeDBandServer();
const converttodotonormal = (dbObject) => {
  return {
    id: id,
    todo: todo,
    priority: priority,
    status: status,
  };
};
const haspriorityAndStatus = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};
const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};
app.get("/todos/", async (request, response) => {
  let data = null;
  let TodoQuery = "";
  const { search_q = "", priority, status } = request.query;
  switch (true) {
    case haspriorityAndStatus(request.query):
      getTodoquery = `select * from todo where todo like '%${search_q}%' and status='${status} and priority='${priority}';`;
      break;
    case hasonlypriority(request.query):
      getTodoquery = `select * from todo where todo like '%${search_q}%' and priority ='${priority}';`;
      break;
    case hasonlystatus(request.query):
      getTodoquery = `select * from todo where todo like '%${search_q}%' and status ='${status}'`;
      break;
    default:
      getTodoquery = `select * from todo where todo like '%${search_q}%';`;
  }
  data = await db.all(getTodoquery);
  response.send(data);
});
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  getsingleQuery = `select * from todo where id=${todoId};`;
  let single = await db.get(getsingleQuery);
  response.send(single);
});
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const postQuery = `insert into todo(id,todo,priority,status) values (${id},'${todo}','${priority}','${status}';`;
  await db.run(postQuery);
  response.send("Todo Successfully Added");
});
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let updateColumn = "";
  const requestBody = request.body;
  switch (true) {
    case requestBody.status !== undefined:
      updateColumn = "Status";
      break;
    case requestBody.priority !== undefined:
      updateColumn = "Priority";
      break;
    case requestBody.todo !== undefined:
      updateColumn = "Todo";
      break;
  }
  const oldQuery = `select * from todo where id=${todoId};`;
  const oldtodo = await db.get(oldtodo);
  const {
    todo = oldtodo.todo,
    priority = oldtodo.priority,
    status = oldtodo.status,
  } = requestBody;
  const updateTodoQuery = `update todo set todo='${todo}',priority='${priority}',status='${status}' where id='${todoId}'`;
  await db.run(updateTodoQuery);
  response.send(`${updateColumn} updated`);
});
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `delete from todo where id='${todoId}';`;
  await db.run(deleteQuery);
  response.send("Todo Deleted");
});
module.exports = app;
