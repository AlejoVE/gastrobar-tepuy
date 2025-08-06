"use client"

import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

const Menu = () => {
  const { t } = useTranslation()

  const menuCategories = [
    {
      id: "appetizers",
      items: [
        {
          name: t("menu.appetizers.item1.name"),
          description: t("menu.appetizers.item1.description"),
          price: t("menu.appetizers.item1.price"),
        },
        {
          name: t("menu.appetizers.item2.name"),
          description: t("menu.appetizers.item2.description"),
          price: t("menu.appetizers.item2.price"),
        },
        {
          name: t("menu.appetizers.item3.name"),
          description: t("menu.appetizers.item3.description"),
          price: t("menu.appetizers.item3.price"),
        },
        {
          name: t("menu.appetizers.item4.name"),
          description: t("menu.appetizers.item4.description"),
          price: t("menu.appetizers.item4.price"),
        },
      ],
    },
    {
      id: "mains",
      items: [
        {
          name: t("menu.mains.item1.name"),
          description: t("menu.mains.item1.description"),
          price: t("menu.mains.item1.price"),
        },
        {
          name: t("menu.mains.item2.name"),
          description: t("menu.mains.item2.description"),
          price: t("menu.mains.item2.price"),
        },
        {
          name: t("menu.mains.item3.name"),
          description: t("menu.mains.item3.description"),
          price: t("menu.mains.item3.price"),
        },
        {
          name: t("menu.mains.item4.name"),
          description: t("menu.mains.item4.description"),
          price: t("menu.mains.item4.price"),
        },
      ],
    },
    {
      id: "grilled",
      items: [
        {
          name: t("menu.grilled.item1.name"),
          description: t("menu.grilled.item1.description"),
          price: t("menu.grilled.item1.price"),
        },
        {
          name: t("menu.grilled.item2.name"),
          description: t("menu.grilled.item2.description"),
          price: t("menu.grilled.item2.price"),
        },
        {
          name: t("menu.grilled.item3.name"),
          description: t("menu.grilled.item3.description"),
          price: t("menu.grilled.item3.price"),
        },
      ],
    },
    {
      id: "desserts",
      items: [
        {
          name: t("menu.desserts.item1.name"),
          description: t("menu.desserts.item1.description"),
          price: t("menu.desserts.item1.price"),
        },
        {
          name: t("menu.desserts.item2.name"),
          description: t("menu.desserts.item2.description"),
          price: t("menu.desserts.item2.price"),
        },
        {
          name: t("menu.desserts.item3.name"),
          description: t("menu.desserts.item3.description"),
          price: t("menu.desserts.item3.price"),
        },
      ],
    },
  ]

  return (
    <section className="bg-pure-white section-spacing">
      <div className="container section-padding">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-light text-forest-green mb-8">
            {t("menu.title")}
          </h2>
          <div className="w-32 h-1 bg-natural-wood mx-auto mb-10"></div>
          <p className="text-body-large leading-relaxed max-w-4xl mx-auto text-charcoal">{t("menu.subtitle")}</p>
        </motion.div>

        <div className="space-y-20">
          {menuCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            >
              <h3 className="font-sans text-3xl md:text-4xl font-semibold text-forest-green mb-12 text-center">
                {t(`menu.${category.id}.title`)}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                    className="bg-warm-cream rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-sans text-xl font-semibold text-forest-green pr-4">{item.name}</h4>
                      <span className="font-sans text-xl font-bold text-natural-wood whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-body text-charcoal leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Drinks Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <h3 className="font-sans text-3xl md:text-4xl font-semibold text-forest-green mb-12 text-center">
            {t("menu.drinks.title")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Beer Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-warm-cream rounded-2xl p-8 shadow-sm"
            >
              <h4 className="font-sans text-2xl font-semibold text-forest-green mb-6 text-center">
                {t("menu.drinks.beer.title")}
              </h4>
              <div className="space-y-3 text-body text-charcoal">
                <p>{t("menu.drinks.beer.item1")}</p>
                <p>{t("menu.drinks.beer.item2")}</p>
                <p>{t("menu.drinks.beer.item3")}</p>
              </div>
            </motion.div>

            {/* Wine Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-warm-cream rounded-2xl p-8 shadow-sm"
            >
              <h4 className="font-sans text-2xl font-semibold text-forest-green mb-6 text-center">
                {t("menu.drinks.wine.title")}
              </h4>
              <div className="space-y-3 text-body text-charcoal">
                <p>{t("menu.drinks.wine.item1")}</p>
                <p>{t("menu.drinks.wine.item2")}</p>
                <p>{t("menu.drinks.wine.item3")}</p>
              </div>
            </motion.div>

            {/* Cocktails Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-warm-cream rounded-2xl p-8 shadow-sm"
            >
              <h4 className="font-sans text-2xl font-semibold text-forest-green mb-6 text-center">
                {t("menu.drinks.cocktails.title")}
              </h4>
              <div className="space-y-3 text-body text-charcoal">
                <p>{t("menu.drinks.cocktails.item1")}</p>
                <p>{t("menu.drinks.cocktails.item2")}</p>
                <p>{t("menu.drinks.cocktails.item3")}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Menu
