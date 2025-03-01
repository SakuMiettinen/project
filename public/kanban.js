const save = () => {
    const saveEvent = new CustomEvent("saveChanges")
    document.dispatchEvent(saveEvent)
}

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
        save()
    })

    kanbanColumn.appendChild(deleteColumnBtn)

    kanbanColumn.id = columnData.id
    const columnTitle = document.createElement("h3")
    makeTextEditable("columnTitle", columnTitle, localColumnsDataArray)
    columnTitle.textContent = columnData.title ? columnData.title : "New Column"
    kanbanColumn.appendChild(columnTitle)

    const addCardbtn = document.createElement("button")
    addCardbtn.textContent = "Add new card"

    addCardbtn.addEventListener("click", () => {
        const parentColumnId = localColumnsDataArray.findIndex(
            column => column.id === columnData.id
        )
        let maxIdCard = localColumnsDataArray[parentColumnId].cards.reduce(
            (max, current) => {
                return current.id > max.id ? current : max
            },
            localColumnsDataArray[parentColumnId].cards[0]
        )
        const newCardObj = {
            id: maxIdCard.id + 1,
            title: "New Card",
            details: "Card Details",
        }
        const cardContainer = createCard(
            columnData.id,
            newCardObj,
            localColumnsDataArray
        )
        kanbanColumn.insertBefore(cardContainer, addCardbtn)

        localColumnsDataArray[parentColumnId].cards.push(newCardObj)
        save()
    })

    kanbanColumn.appendChild(addCardbtn)

    for (let card of columnData.cards) {
        const cardData = {
            id: card.id,
            title: card.title,
            details: card.details,
        }
        const cardContainer = createCard(
            columnData.id,
            cardData,
            localColumnsDataArray
        )
        kanbanColumn.insertBefore(cardContainer, addCardbtn)
    }

    container.appendChild(kanbanColumn)
}

const createCard = (parentId, cardData, localColumnsDataArray) => {
    const cardContainer = document.createElement("div")
    cardContainer.id = cardData.id
    cardContainer.classList.add("card-container")
    const cardTitle = document.createElement("h4")
    cardTitle.textContent = cardData.title
    makeTextEditable("cardTitle", cardTitle, localColumnsDataArray)

    const cardDetails = document.createElement("p")
    cardDetails.textContent = cardData.details
    makeTextEditable("cardDetails", cardDetails, localColumnsDataArray)

    cardContainer.appendChild(cardTitle)
    cardContainer.appendChild(cardDetails)

    const deleteCardBtn = document.createElement("button")
    deleteCardBtn.textContent = "X"
    deleteCardBtn.classList.add("delete-card-btn")

    deleteCardBtn.addEventListener("click", () => {
        cardContainer.remove()
        const parentColumnId = localColumnsDataArray.findIndex(
            column => column.id === parentId
        )

        const index = localColumnsDataArray[parentColumnId].cards.findIndex(
            card => card.id === cardData.id
        )
        localColumnsDataArray[parentColumnId].cards.splice(index, 1)

        save()
    })

    cardContainer.appendChild(deleteCardBtn)

    const moveCardBtnContainer = document.createElement("div")
    moveCardBtnContainer.classList.add("move-card-btn-container")

    const moveCardLeftBtn = document.createElement("button")
    moveCardLeftBtn.textContent = "←"
    moveCardLeftBtn.addEventListener("click", () => {
        moveCard("left", cardContainer, localColumnsDataArray)
    })
    const moveCardRightBtn = document.createElement("button")
    moveCardRightBtn.textContent = "→"
    moveCardRightBtn.addEventListener("click", () => {
        moveCard("right", cardContainer, localColumnsDataArray)
    })
    const moveCardUpBtn = document.createElement("button")
    moveCardUpBtn.textContent = "↑"
    moveCardUpBtn.addEventListener("click", () => {
        moveCard("up", cardContainer, localColumnsDataArray)
    })
    const moveCardDownBtn = document.createElement("button")
    moveCardDownBtn.textContent = "↓"
    moveCardDownBtn.addEventListener("click", () => {
        moveCard("down", cardContainer, localColumnsDataArray)
    })

    moveCardBtnContainer.append(
        moveCardUpBtn,
        moveCardDownBtn,
        moveCardLeftBtn,
        moveCardRightBtn
    )

    cardContainer.appendChild(moveCardBtnContainer)

    return cardContainer
}

const moveCard = (direction, cardContainer, localColumnsDataArray) => {
    const parentEl = cardContainer.closest(".kanban-column")
    const parentColumn = cardContainer.parentNode
    const parentColumnId = parseInt(parentColumn.id)
    const parentIdx = localColumnsDataArray.findIndex(column => {
        // For some reason only doing column.id === parentColumnId was returning -1?????
        if (column.id === parentColumnId) {
            return true
        }
        return false
    })

    let cardOver = cardContainer.previousElementSibling.classList.contains(
        "card-container"
    )
        ? cardContainer.previousElementSibling
        : null
    let cardUnder = cardContainer.nextElementSibling.classList.contains(
        "card-container"
    )
        ? cardContainer.nextElementSibling
        : null

    const newLeftParentEl = parentEl.previousElementSibling
    const newRightParentEl = parentEl.nextElementSibling

    const parentCardsArray = localColumnsDataArray[parentIdx].cards
    switch (direction) {
        case "up":
            if (cardOver) {
                const cardIdx = parentCardsArray.findIndex(card => {
                    if (card.id === parseInt(cardContainer.id)) {
                        return true
                    }
                    return false
                })
                ;[parentCardsArray[cardIdx], parentCardsArray[cardIdx - 1]] = [
                    parentCardsArray[cardIdx - 1],
                    parentCardsArray[cardIdx],
                ]
                parentColumn.insertBefore(cardContainer, cardOver)
                save()
            }
            break
        case "down":
            if (cardUnder) {
                const cardIdx = parentCardsArray.findIndex(card => {
                    if (card.id === parseInt(cardContainer.id)) {
                        return true
                    }
                    return false
                })
                ;[parentCardsArray[cardIdx], parentCardsArray[cardIdx + 1]] = [
                    parentCardsArray[cardIdx + 1],
                    parentCardsArray[cardIdx],
                ]
                parentColumn.insertBefore(cardUnder, cardContainer)
                save()
            }
            break
        case "left":
            if (newLeftParentEl) {
                cardContainer.remove()
                newLeftParentEl.insertBefore(
                    cardContainer,
                    newLeftParentEl.lastElementChild
                )
                const newParentIdx = localColumnsDataArray.findIndex(column => {
                    if (column.id === parseInt(newLeftParentEl.id)) {
                        return true
                    }
                    return false
                })
                const newSiblingCards =
                    localColumnsDataArray[newParentIdx].cards
                let max = -1
                let hasSameIndex = false
                for (let card of newSiblingCards) {
                    if (card.id === parseInt(cardContainer.id)) {
                        hasSameIndex = true
                    }
                    if (card.id > max) {
                        max = card.id
                    }
                }

                const cardObjIdx = localColumnsDataArray[
                    parentIdx
                ].cards.findIndex(card => {
                    if (card.id === parseInt(cardContainer.id)) {
                        return true
                    }
                    return false
                })

                const cardObj = localColumnsDataArray[parentIdx].cards.splice(
                    cardObjIdx,
                    1
                )[0]

                if (hasSameIndex) {
                    cardContainer.id = max + 1
                    cardObj.id = max + 1
                }
                localColumnsDataArray[newParentIdx].cards.push(cardObj)
            }
            break
        case "right":
            if (newRightParentEl) {
                cardContainer.remove()
                newRightParentEl.insertBefore(
                    cardContainer,
                    newRightParentEl.lastElementChild
                )
                const newParentIdx = localColumnsDataArray.findIndex(column => {
                    if (column.id === parseInt(newRightParentEl.id)) {
                        return true
                    }
                    return false
                })
                const newSiblingCards =
                    localColumnsDataArray[newParentIdx].cards
                let max = -1
                let hasSameIndex = false
                for (let card of newSiblingCards) {
                    if (card.id === parseInt(cardContainer.id)) {
                        hasSameIndex = true
                    }
                    if (card.id > max) {
                        max = card.id
                    }
                }

                const cardObjIdx = localColumnsDataArray[
                    parentIdx
                ].cards.findIndex(card => {
                    if (card.id === parseInt(cardContainer.id)) {
                        return true
                    }
                    return false
                })

                const cardObj = localColumnsDataArray[parentIdx].cards.splice(
                    cardObjIdx,
                    1
                )[0]

                if (hasSameIndex) {
                    cardContainer.id = max + 1
                    cardObj.id = max + 1
                }
                localColumnsDataArray[newParentIdx].cards.push(cardObj)
            }
            break
    }

    save()
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
                        save()
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
