import React, { useState, useEffect } from "react";
import List from "./list.jsx";

const Home = () => {

	const [todoItem, setTodoItem] = useState("");
	const [todoList, setTodoList] = useState([]);

	const [user, setUser] = useState("francisco");

	
	function createUser() {
		fetch('https://assets.breatheco.de/apis/fake/todos/user/' + user,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify([])
			})
			.then(resp => resp.json())
			.then(data => console.log(data))
			.catch(err => console.error(err))
	}

	const getUserList = async () => {
		await fetch('https://assets.breatheco.de/apis/fake/todos/user/' + user,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((response) => response.json()) 
			.then((data) => setTodoList(data)) 
			.catch((err) => console.error(err)) 
	}

	
	 
	
	const putUserList = async (list = todoList) => {
		await fetch('https://assets.breatheco.de/apis/fake/todos/user/' + user,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(list)
			})
			.then((response) => response.json())
			.then((data)=>console.log(data))
			.catch(err => console.error(err))
	}

	
	const handlerNewItem = (e) => {
		if (e.key === "Enter" && e.target.value !== '') {
			setTodoList([...todoList, { label: todoItem, done: false }]);
			setTodoItem("");
			putUserList();
		}
	}


	const handleRemoveItem = (index) => {
		setTodoList(todoList.filter((_, i) => i !== index));

		todoList.length > 0
			? putUserList()
			: putUserList([]);

	}

	const handleDone = async (index) => {
		todoList[index].done = !todoList[index].done;

		await putUserList()
		await getUserList()
	}


	const leftTasks = (list = todoList) =>
		list?.length > 0
			? list.length - list.filter(item => item.done === true).length
			: 0

	useEffect(() => {
		
		getUserList()
	}, [])

	return (
		<main className="container my-sm-2 my-lg-5 mx-auto p-lg-5 ">
			<h1 className="text-center fw-bolder text-light">To-do List</h1>
			<div className="container">
				<input
					type="text"
					name="todo"
					id="todo"
					className="fs-3 p-2 w-100 mx-auto border border-light rounded"
					onChange={(e) => setTodoItem(e.target.value)}
					onKeyDown={handlerNewItem}
					value={todoItem}
					placeholder="Add a new todo"
				/>
				<ul className="list-group list-group-flush fs-3">
					<List items={todoList} onDone={handleDone} onRemoveItem={handleRemoveItem}></List>
				</ul>
				<div className={`p-2 mt-1 bg-light rounded${todoList.length > 0 ? " border-top" : ""}`}>
					<small >{`${leftTasks()} item${leftTasks() == 1 ? "" : "s"} left`}</small>
				</div>
			</div>
		</main>
	);
};

export default Home;