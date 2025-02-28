const createColumn = (columnData, container, localColumnsDataArray) => {
    const kanbanColumn = document.createElement("div")
    kanbanColumn.classList.add("kanban-column")

    const deleteColumnBtn = document.createElement("button")
    deleteColumnBtn.classList.add("delete-column-button")
    deleteColumnBtn.textContent = "X"

    deleteColumnBtn.addEventListener("click", () => {
        const indexToRemove = localColumnsDataArray.findIndex(
            column => column.id === columnData.id
        )

        localColumnsDataArray.splice(indexToRemove, 1)
    })

    kanbanColumn.appendChild(deleteColumnBtn)

    kanbanColumn.id = columnData.id
    const columnTitle = document.createElement("h3")
    makeTextEditable("columnTitle", columnTitle, localColumnsDataArray)
    columnTitle.textContent = columnData.title ? columnData.title : "New Column"
    kanbanColumn.appendChild(columnTitle)

    for (let card of columnData.cards) {
        const cardContainer = document.createElement("div")
        cardContainer.id = card.id
        cardContainer.classList.add("card-container")
        const cardTitle = document.createElement("h4")
        cardTitle.textContent = card.title
        makeTextEditable("cardTitle", cardTitle, localColumnsDataArray)

        const cardDetails = document.createElement("p")
        cardDetails.textContent = card.details
        makeTextEditable("cardDetails", cardDetails, localColumnsDataArray)

        cardContainer.appendChild(cardTitle)
        cardContainer.appendChild(cardDetails)
        kanbanColumn.appendChild(cardContainer)
    }

    container.appendChild(kanbanColumn)
}

const makeTextEditable = (textType, textEl, localColumnsDataArray) => {
    textEl.addEventListener("dblclick", () => {
        textEl.setAttribute("contenteditable", "true")
        textEl.focus()
        const parentColumnId = parseInt(textEl.closest(".kanban-column").id)

        textEl.focus()

        const saveChanges = () => {
            let cardId
            let cardToModify
            const columnToModify = localColumnsDataArray.find(
                column => column.id === parentColumnId
            )

            if (textType === "columnTitle") {
                columnToModify.title = textEl.textContent
            } else {
                cardId = parseInt(textEl.closest(".card-container").id)
                cardToModify = columnToModify.cards.find(
                    card => card.id === cardId
                )

                if (textType === "cardTitle") {
                    cardToModify.title = textEl.textContent
                } else {
                    cardToModify.details = textEl.textContent
                }
            }

            // Custom event to save all the changes
            const saveEvent = new CustomEvent("saveChanges")

            document.dispatchEvent(saveEvent)
        }

        textEl.addEventListener("blur", saveChanges)
        textEl.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault()
                textEl.blur()
            }
        })
    })
}

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("jswt")

    if (!token) {
        const container = document.querySelector(".kanban-container")
        container.textContent =
            "You need to Login or Register to access this restricted resource"
    } else {
        fetch("http://localhost:3000/get-user-kanban-data", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    // All column data from db. Also used as a local storage until user saves and
                    // then updated to db
                    const kanbanColumns = data.kanbanData.columns
                    let maxId
                    let maxIdColumn = kanbanColumns.reduce((max, current) => {
                        return current.id > max.id ? current : max
                    }, kanbanColumns[0])

                    maxIdColumn ? (maxId = maxIdColumn.id) : (maxId = 0)

                    const container =
                        document.querySelector(".kanban-container")

                    const buttonsContainer =
                        container.querySelector(".kanban-buttons")

                    const columnsContainer =
                        container.querySelector(".kanban-columns")

                    // Add new column
                    const addColumnBtn = document.createElement("button")
                    addColumnBtn.textContent = "Add new column"
                    addColumnBtn.addEventListener("click", () => {
                        const emptyKanbanColumnObj = {
                            id: (maxId += 1),
                            title: "New Column",
                            cards: [
                                {
                                    id: 0,
                                    title: "New Card",
                                    details: "Card Details",
                                },
                            ],
                        }
                        kanbanColumns.push(emptyKanbanColumnObj)
                        createColumn(
                            emptyKanbanColumnObj,
                            columnsContainer,
                            kanbanColumns
                        )
                    })
                    buttonsContainer.appendChild(addColumnBtn)

                    // Save current state
                    document.addEventListener("saveChanges", () => {
                        fetch("http://localhost:3000/update-user-kanban-data", {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                columnData: kanbanColumns,
                            }),
                        }).then(res => {
                            console.log("OIAJOIJGAWE")
                            if (res.ok) {
                                res.json().then(data => {
                                    console.log(data.msg)
                                })
                            }
                        })
                    })

                    for (const columnData of kanbanColumns) {
                        createColumn(
                            columnData,
                            columnsContainer,
                            kanbanColumns
                        )
                    }
                })
            } else {
                console.error("Server error")
                const container = document.querySelector(".kanban-container")
                container.textContent = "Unexpected error. Try to login again."
            }
        })
    }
})
