let provider = dataBinding.observable({
        greeting: "Hello",
        name: "William"
    }),
    producer = document.getElementById("producer"),
    consumer = document.getElementById("consumer")

dataBinding.observe(() => {
    consumer.innerHTML = provider.greeting + " " + provider.name
})

producer.onkeyup = (evt) => {
    provider.name = evt.target.value
}
