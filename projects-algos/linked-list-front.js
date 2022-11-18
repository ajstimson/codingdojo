// Construct Single Node
class Node {
    constructor(data, next = null) {
        this.data = data
        this.next = next
    }
}

class SLL {
    constructor() {
        this.head = null
        this.size = 0
    }

    // Insert first node
    addFront(data) {
        this.head = new Node(data, this.head)
        this.size++
    }

    removeFront() {
        if (this.head) {
            this.head = this.head.next
            this.size--
        }
    }

    //Display Front
    displayFront() {
        if (this.head) {
            console.log(this.head.data)
        }
    }
}

const SLL1 = new SLL()

SLL1.addFront(100)
SLL1.addFront(200)
SLL1.addFront(300)
SLL1.addFront(400)
console.log("before removeFront")
SLL1.displayFront()
SLL1.removeFront()
console.log("after removeFront")
SLL1.displayFront()
