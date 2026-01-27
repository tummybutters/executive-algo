
import { motion, useReducedMotion } from 'motion/react';
import NewsletterForm from '../components/NewsletterForm.jsx';

export default function EditorialPage({ data, slug }) {
    const prefersReducedMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <main className="editorial-page">
            <section className="editorial-hero">
                <div className="container">
                    <motion.div
                        className="editorial-header"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.h1 className="editorial-title" variants={itemVariants}>
                            {data.title}
                        </motion.h1>
                        <motion.p className="editorial-subtitle" variants={itemVariants}>
                            {data.subtitle}
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            <section className="editorial-content">
                <div className="container">
                    <motion.div
                        className="content-grid"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={containerVariants}
                    >
                        {data.sections.map((section, index) => (
                            <motion.div className="content-block" key={index} variants={itemVariants}>
                                <h2>{section.heading}</h2>
                                <p>{section.body}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="editorial-cta">
                <div className="container">
                    <div className="cta-wrapper">
                        <h3>Join the Index.</h3>
                        <NewsletterForm
                            buttonLabel="Subscribe"
                            source={`page-${slug}`}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
