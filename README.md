# basic-color-classifier
Basic color recognition based on KNN algorithm. It reads the very first pixel of the provided PNG image and predicts its color.

### How to use it?

Before you can use this classifier you have to create the training data file. Once it's created it doesn't need to be regenerated unless the training dataset has changed. To create the training data file run:

```sbtshell
$ node index.js --build
```

Once it's done, there should be created `training.data` file in the current working directory.

Then, just put some images directly into the `./test-dataset/` directory and then run

```sbtshell
$ node index.js
```

In the result you will see the list of your files followed by the predicted color.

#### Notice:
At the moment this classifier can predict only following colors: black, blue, green, pink, red and white. If you want to make it classify more colors simply create more samples and place them into the `./training-dataset/` similarly as they are placed now. After that, remember to regenerate the training data file as described above.