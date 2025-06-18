const HowItWorksPreview = () => {
    const steps = [
      {
        number: "1",
        title: "Choose a Service",
        description: "Select from our wide range of home services",
        icon: "🔍",
      },
      {
        number: "2",
        title: "Pick a Time",
        description: "Choose your preferred date and time slot",
        icon: "📅",
      },
      {
        number: "3",
        title: "We Send a Pro",
        description: "A verified professional arrives at your door",
        icon: "👨‍🔧",
      },
      {
        number: "4",
        title: "Pay After Job Done",
        description: "Pay only when you're completely satisfied",
        icon: "💳",
      },
    ]
  
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get your home fixed</p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:bg-gray-800 transition-colors">
                  {step.number}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-black mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  export default HowItWorksPreview
  