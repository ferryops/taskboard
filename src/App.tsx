import React, { useState, ChangeEvent, useEffect } from "react";
import "./App.css";
import { CiEdit } from "react-icons/ci";

export default function PencatatTugas() {
  const [showCategory, setShowCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newNameCategory, setNewNameCategory] = useState<string>("");
  const [showMenuCategory, setShowMenuCategory] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [clickedCategoryIndex, setClickedCategoryIndex] = useState<number>();
  const [newTitleTask, setNewTitleTask] = useState<string>();
  const [selectedStartDate, setSelectedStartDate] = useState<string>();
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const date = ("0" + currentDate.getDate()).slice(-2);
  const [splashScreen, setSplashScreen] = useState(false);

  const AddCategory = () => {
    setShowCategory(true);
    setShowModal(true);
  };
  const resetLocalStorage = () => {
    localStorage.removeItem("categories");
    alert("semua tugas di reset");
    window.location.reload();
  };
  const cancelEditCategory = () => {
    setShowEditCategory(false);
  };
  const showMenuDotCategory = (index: any) => {
    setClickedCategoryIndex(index);
    setShowMenuCategory(true);
  };
  const closeMenuDotCategory = () => {
    setShowMenuCategory(false);
  };
  const handleChangeNewNameCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNameCategory(event.target.value);
  };
  const closeAddTask = () => {
    setShowTask(false);
    setTitleTask("");
  };

  // function show modal edit category
  const editCategory = (categoryIndex: number) => {
    setShowMenuCategory(false);
    setShowEditCategory(true);
    setSelectedCategoryIndex(categoryIndex);
  };

  interface Category {
    name: string;
    tasks: Array<{
      nameTask: string;
      startDate: string;
      endDate: string;
      descriptionTask: string;
    }>;
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // function create category
  const createNewCategory = () => {
    if (inputValue === "") {
      alert("Nama kategori kosong");
      return;
    }
    const newCategory = {
      name: inputValue,
      tasks: [],
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    setShowCategory(false);
    setInputValue("");
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
  };

  // function edit old category
  const editOldCategory = (categoryName: string, categoryIndex: number) => {
    const newName = newNameCategory;

    const updatedCategories = categories.map((category) => {
      if (category.name === categoryName) {
        return { ...category, name: newName };
      }
      return category;
    });

    setCategories(updatedCategories);
    setInputValue("");
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    setShowEditCategory(false);
    setNewNameCategory("");
  };

  // function delete category
  const deleteCategory = (categoryIndex: number) => {
    const updatedCategories = categories.filter((_, index) => index !== categoryIndex);
    setCategories(updatedCategories);
    setInputValue("");
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
  };

  // function open task
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>();
  const openTask = (categoryIndex: number) => {
    setShowTask(true);
    setSelectedCategoryIndex(categoryIndex);
  };

  const [titleTask, setTitleTask] = useState<string>("");
  const [descriptionTask, setDescriptionTask] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>();

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleTask(event.target.value);
  };

  // function add task
  const addTask = (categoryIndex: number, taskArray: Task) => {
    const { nameTask, startDate, endDate, descriptionTask } = taskArray;
    if (!nameTask) {
      alert("nama tugas tidak boleh kosong");
      return;
    }
    const updatedCategories = [...categories];
    const categoryToUpdate = updatedCategories[categoryIndex];

    const task = {
      nameTask,
      startDate,
      endDate,
      descriptionTask,
    };

    if (!categoryToUpdate.tasks.includes(task)) {
      categoryToUpdate.tasks = [...categoryToUpdate.tasks, task];
    }
    setCategories(updatedCategories);
    setTitleTask("");
    setDescriptionTask("");
    setShowTask(false);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
  };

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      setCategories(parsedCategories);
    }
  }, []);

  // function handle dnd task
  const handleDrop = (sourceCategoryIndex: number, sourceTaskIndex: number, droppedCategoryIndex: number) => {
    const taskToMove = categories[sourceCategoryIndex].tasks[sourceTaskIndex];
    const updatedCategories = categories.map((category, index) => {
      if (index === sourceCategoryIndex) {
        category.tasks.splice(sourceTaskIndex, 1);
      }
      if (index === droppedCategoryIndex) {
        return {
          ...category,
          tasks: [...category.tasks, taskToMove],
        };
      }
      return category;
    });
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
  };

  // function open modal edit task
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>();
  const [selectedNameTask, setSelectedNameTask] = useState<string>();
  const editTask = (taskIndex: number, task: string) => {
    setShowEditTask(true);
    setSelectedTaskIndex(taskIndex);
    setSelectedNameTask(task);
  };

  // close edit task modal
  const closeEditTask = () => {
    setShowEditTask(false);
  };

  // function edit task
  interface Task {
    nameTask: string;
    startDate: string;
    endDate: string;
    descriptionTask: string;
  }
  const updateTask = (categoryIndex: number, taskIndex: number, updatedTask: Task) => {
    const { nameTask } = updatedTask;

    if (nameTask === "") {
      alert("Nama tugas tidak boleh kosong");
      return;
    }

    const updatedCategories = [...categories];
    const categoryToUpdate = updatedCategories[categoryIndex];

    if (categoryToUpdate && categoryToUpdate.tasks && categoryToUpdate.tasks.length > taskIndex) {
      categoryToUpdate.tasks[taskIndex] = updatedTask;
      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
    }
    setNewTitleTask("");
    setShowEditTask(false);
  };

  const closeAddCategory = () => {
    setShowCategory(false);
    setInputValue("");
  };
  return (
    <>
      <head>
        <title>Catat Tugas</title>
        <meta name="description" content="ferryops | apps " />
        <meta name="keywords" content="ferry ananda febian, software engineer, next.js, react.js" />
        <meta name="author" content="admin ganteng" />
        <meta property="og:title" content="Beranda" />
        <meta property="og:description" content="ferryops | apps" />
        <meta property="og:image" content="https://ferryops.vercel.app/img/ferry.webp" />
        <meta property="og:url" content="https://ferryops.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>

      <div className="container">
        <div className="container-right">
          {/* list category here */}
          {categories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="task"
              onDragOver={(e) => {
                e.preventDefault();
              }}
            >
              <div className="new-category">
                <div className="category-header">
                  <span>{category.name}</span>
                  <div className="dot-menu" onClick={() => showMenuDotCategory(categoryIndex)}>
                    <CiEdit />
                  </div>
                  {showMenuCategory ? (
                    clickedCategoryIndex === categoryIndex ? (
                      <div className="dropdown-content">
                        <div className="dropdown-content-in" onClick={() => editCategory(categoryIndex)}>
                          <span>Edit</span>
                        </div>
                        <div className="dropdown-content-in" onClick={() => deleteCategory(categoryIndex)}>
                          <span>Hapus</span>
                        </div>
                        <div className="dropdown-content-in" onClick={closeMenuDotCategory}>
                          <span>Close</span>
                        </div>
                      </div>
                    ) : null
                  ) : null}
                </div>
                <div className="add-task" onClick={() => openTask(categoryIndex)}>
                  <span>+</span>
                  <span>Tambah Tugas</span>
                </div>
              </div>

              {/* list task in category here */}
              {category.tasks.map((task, taskIndex) => (
                <div
                  onClick={() => editTask(taskIndex, task.nameTask)}
                  className="task-list"
                  key={taskIndex}
                  draggable={true}
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                    e.dataTransfer.setData("text/plain", "");
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("categoryIndex", String(categoryIndex));
                    e.dataTransfer.setData("taskIndex", String(taskIndex));
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("drag-over");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("drag-over");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("drag-over");
                    const sourceCategoryIndex = parseInt(e.dataTransfer.getData("categoryIndex"), 10);
                    const sourceTaskIndex = parseInt(e.dataTransfer.getData("taskIndex"), 10);
                    handleDrop(sourceCategoryIndex, sourceTaskIndex, categoryIndex);
                  }}
                >
                  <div className={"task-dnd"}>
                    <div className={"task-dnd-title"}>
                      <h5>{task.nameTask}</h5>
                    </div>
                    <hr />
                    <div className={"task-dnd-chat"}>
                      <div className={"task-dnd-date"}>{task.endDate}</div>
                    </div>
                  </div>
                </div>
              ))}
              {/* when task is empty */}
              {category.tasks.length === 0 ? (
                <div
                  className={"task-list-0"}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("drag-over");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("drag-over");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("drag-over");
                    const sourceCategoryIndex = parseInt(e.dataTransfer.getData("categoryIndex"), 10);
                    const sourceTaskIndex = parseInt(e.dataTransfer.getData("taskIndex"), 10);
                    handleDrop(sourceCategoryIndex, sourceTaskIndex, categoryIndex);
                  }}
                >
                  <span>Tugas kosong</span>
                </div>
              ) : null}
            </div>
          ))}
          <div className={"category"} onClick={AddCategory}>
            <span>+</span>
            <span>Tambah Kategori</span>
          </div>
        </div>
      </div>

      {/* Modal add category */}
      {showCategory ? (
        <div className={"popup"}>
          <div className={"popup-content"}>
            <p>Buat Kategori</p>
            <span>Nama kategori</span>
            <div className={"input-category"}>
              <input type="text" placeholder="tugas hari ini" value={inputValue} onChange={handleChange} />
            </div>
            <div className={"div-button"}>
              <button onClick={closeAddCategory} className={"cancel"}>
                Batal
              </button>
              <button onClick={createNewCategory} className={"save"}>
                Simpan
              </button>
            </div>
          </div>
          <div className={"footer"}>
            <div className={"footer-left"}></div>
            <div className={"footer-right"}></div>
          </div>
        </div>
      ) : null}

      {/* modal add task */}
      {categories.map(
        (category, categoryIndex) =>
          showTask &&
          categoryIndex === selectedCategoryIndex && (
            <div className={"popup"} key={categoryIndex}>
              <div className={"popup-task"}>
                <h3>Tugas</h3>
                <div className={"task-info"}>
                  <h5>{category.name}</h5>
                  <br />
                  <input type="text" placeholder="Nama Tugas" value={titleTask} onChange={handleChangeTitle} />
                </div>

                <div className={"comment"}>
                  <button onClick={closeAddTask} className={"cancel"}>
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      const taskArray: Task = {
                        nameTask: titleTask || "",
                        descriptionTask: descriptionTask,
                        startDate: selectedStartDate || year + "-" + month + "-" + date,
                        endDate: selectedEndDate || year + "-" + month + "-" + date,
                      };
                      addTask(categoryIndex, taskArray);
                    }}
                    className={"save"}
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          )
      )}

      {/* modal edit task */}
      {categories.map((category, categoryIndex) =>
        category.tasks.map(
          (task, taskIndex) =>
            showEditTask &&
            taskIndex === selectedTaskIndex &&
            task.nameTask === selectedNameTask && (
              <div className={"popup"} key={taskIndex}>
                <div className={"popup-task"}>
                  <h3>Edit Tugas</h3>
                  <div className={"task-info"}>
                    <h5>Edit Tugas : {task.nameTask}</h5>
                    <br />
                    <input
                      type="text"
                      placeholder="Nama Tugas"
                      value={newTitleTask}
                      onChange={(e) => setNewTitleTask(e.target.value)}
                    />
                  </div>

                  <div className={"comment"}>
                    <button onClick={closeEditTask} className={"cancel"}>
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        const updatedTask: Task = {
                          nameTask: newTitleTask || task.nameTask,
                          descriptionTask: descriptionTask,
                          startDate: selectedStartDate || year + "-" + month + "-" + date,
                          endDate: selectedEndDate || year + "-" + month + "-" + date,
                        };
                        updateTask(categoryIndex, taskIndex, updatedTask);
                      }}
                      className={"save"}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )
        )
      )}

      {/* modal edit category */}
      {categories.map((category, categoryIndex) =>
        showEditCategory && categoryIndex === selectedCategoryIndex ? (
          <div className={"popup"} key={categoryIndex}>
            <div className={"popup-content"}>
              <p>Edit Card</p>
              <span>Nama Card Lama</span>
              <div className={"nama-workspace"}>{category.name}</div>
              <span>Nama Card Baru </span>
              <div className={"input-category"}>
                <input
                  type="text"
                  placeholder="nama board"
                  value={newNameCategory}
                  onChange={handleChangeNewNameCategory}
                />
              </div>
              <div className={"div-button"}>
                <button onClick={cancelEditCategory} className={"cancel"}>
                  Batal
                </button>
                <button onClick={() => editOldCategory(category.name, categoryIndex)} className={"save"}>
                  Simpan
                </button>
              </div>
            </div>
            <div className={"footer"}>
              <div className={"footer-left"}></div>
              <div className={"footer-right"}></div>
            </div>
          </div>
        ) : null
      )}

      {/* splash screen */}
      {!splashScreen ? (
        <div className={"popup"}>
          <div className={"popup-content"}>
            <p>Selamat datang di Aplikasi</p>
            <p>Catat-catat tugas</p>
            <span>Disini kamu bisa menambahkan, mengedit, menghapus dan drag n drop tugas</span>
            <div className={"button-splash-screen"}>
              <button onClick={() => setSplashScreen(true)}>Tutup</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
