
import { motion, useReducedMotion } from 'motion/react';
import { trackingCategories } from '../data/home.js';
import NewsletterForm from '../components/NewsletterForm.jsx';

export default function PeoplePage() {
    const prefersReducedMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <main className="people-directory-page">
            <section className="people-hero">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Who We Track
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="people-subtitle"
                    >
                        Expanding weekly as new voices earn conviction.
                    </motion.p>
                </div>
            </section>

            <div className="container">
                <div className="people-directory-grid">
                    {trackingCategories.map((category, index) => (
                        <motion.div
                            className="directory-category"
                            key={category.title}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <motion.div variants={itemVariants} className="category-header">
                                <h2>{category.title}</h2>
                                <span className="category-subtitle">{category.subtitle}</span>
                            </motion.div>
                            <motion.ul variants={itemVariants} className="category-list">
                                {category.entries.map((person) => (
                                    <li key={person}>{person}</li>
                                ))}
                            </motion.ul>
                        </motion.div>
                    ))}
                </div>
            </div>

            <section className="people-cta">
                <div className="container">
                    <div className="cta-wrapper">
                        <h3>Monitor the conversation.</h3>
                        <NewsletterForm
                            buttonLabel="Join the Index"
                            source="page-people"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
