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

    // Insert last node
    addLast(data) {
        let node = new Node(data)
        let current

        // If empty, make head
        if (!this.head) {
            this.head = node
        } else {
            current = this.head

            while (current.next) {
                current = current.next
            }

            current.next = node
        }

        this.size++
    }

    // Insert at i
    insertAt(data, i) {
        //  If i is out of range
        if (i > 0 && i > this.size) {
            return
        }

        // If first i
        if (i === 0) {
            this.addFront(data)
            return
        }

        const node = new Node(data)
        let current, previous

        // Set current to first
        current = this.head
        let count = 0

        while (count < i) {
            previous = current // Node before i
            count++
            current = current.next // Node after i
        }

        node.next = current
        previous.next = node

        this.size++
    }

    // Print list data
    display() {
        let current = this.head

        while (current) {
            console.log(current.data)
            current = current.next
        }
    }
}

const SLL1 = new SLL()

SLL1.addFront(100)
SLL1.addFront(200)
SLL1.addFront(300)
SLL1.addLast(400)
SLL1.insertAt(500, 2)

SLL1.display()
