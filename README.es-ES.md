

# F1nsight

¡Bienvenido a F1nsight! Este proyecto está dedicado a proporcionar a los entusiastas de la Fórmula 1 análisis detallados de datos de carreras pasadas, incluyendo tablas de clasificación, tiempos por vuelta, estrategias de neumáticos y las vueltas más rápidas de cada piloto. Explora un lienzo interactivo que te permite visualizar los datos de telemetría de los pilotos de F1 seleccionados, rastreando su rendimiento en la pista vuelta por vuelta, complementado con diferentes ángulos de cámara para una experiencia de visualización mejorada.

![F1nsight Animation](/public/Media/animation-grid_1.gif)
![F1nsight Visualization](/public/images/F1nsightMeta.jpg)

## Características

**F1nsight** ofrece varias características emocionantes:

- **Tablas de clasificación detalladas:** Obtén clasificaciones y estadísticas completas de carreras anteriores.
- **Análisis de tiempos por vuelta:** Sumérgete en métricas de rendimiento vuelta por vuelta para estudiar la consistencia y la estrategia.
- **Estrategias de neumáticos:** Comprende cómo se desarrollan las diferentes elecciones de neumáticos durante una carrera.
- **Vueltas más rápidas:** Descubre qué pilotos lograron las vueltas más rápidas durante cada evento.
- **Visor de telemetría interactivo:** Sigue los datos de telemetría de tus pilotos favoritos mientras recorren la pista, con opciones para cambiar entre varios ángulos de cámara para una perspectiva dinámica.

## Lienzo Interactivo

Nuestro lienzo interactivo es una característica destacada, que ofrece a los usuarios una simulación en tiempo real de datos de telemetría. Esta herramienta permite a los aficionados:

- Seleccionar un piloto y ver cómo se desarrolla su carrera vuelta por vuelta.
- Cambiar entre múltiples vistas de cámara para obtener una mirada más cercana a las estrategias de carrera y las habilidades de los pilotos.
- Analizar representaciones detalladas de velocidad, marcha y posición en la pista por piloto.

## Aviso

Tenga en cuenta que F1nsight es un proyecto no oficial y no está asociado de ninguna manera con las empresas de Fórmula 1. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX y marcas relacionadas son marcas comerciales de Formula One Licensing B.V.

## Sitio Web

Para obtener más información y acceder a las funciones interactivas, visite nuestro sitio web en [F1nsight](https://f1nsight.com/).

## Nuestra API Personalizada

Parte de la información relacionada con la comparación de pilotos y otras estadísticas importantes es proporcionada por nuestra propia API, disponible en [F1nsight API](https://github.com/praneeth7781/f1nsight-api-2)

## OpenF1

La aplicación lee los datos de OpenF1 desde `REACT_APP_OPENF1_BACKEND_BASE_URL`.

Por defecto, esto apunta directamente a:

```txt
https://api.openf1.org
```

La aplicación agrega `/v1` automáticamente, por lo que no debes incluir `/v1` en el valor de la variable de entorno. Las solicitudes de OpenF1 se enrutan a través de un asistente compartido del frontend que ralentiza las llamadas, reintenta los límites de frecuencia y almacena en caché las respuestas repetidas en la memoria.

## Soporte y Contribución

¡Las contribuciones a F1nsight son siempre bienvenidas! Ya sea mejorar la base de código, agregar nuevas características o corregir errores, no dudes en bifurcar el repositorio y enviar un pull request.

## Licencia

Este proyecto está licenciado bajo nuestra licencia personalizada. Para más detalles, consulte la [LICENSE](https://github.com/adityakotha03/F1nsight?tab=License-1-ov-file).

## Agradecimientos

- ¡Gracias a todos los aficionados de la Fórmula 1 y a los colaboradores de la comunidad que mantienen este proyecto en funcionamiento!
- Agradecimiento especial a los proveedores de datos y al servicio de API [OpenF1](https://openf1.org/) que permiten el acceso a datos actuales e históricos de F1.
- Este trabajo se basa en "basic Lowpoly F1 Car V1" de arthihalder, disponible bajo una licencia Creative Commons Atribución 4.0 Internacional. [Ver el modelo en Sketchfab](https://sketchfab.com/3d-models/basic-lowpoly-f1-car-v1-b4c6a1cfe0154f4d86b39ff3b7f955a1). Los detalles de la licencia se pueden encontrar en [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/).

## Contacto

Para cualquier pregunta o sugerencia, por favor [abre una discusión](https://github.com/adityakotha03/F1nsight/discussions) en GitHub.

¡Disfruta explorando los datos y perspectivas en F1nsight!
