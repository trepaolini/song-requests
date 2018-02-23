# Authentication

In this problem set, we'll walk through setting up an application powered by [Firebase](https://firebase.google.com/). Make sure to reference the [course book chapter](https://info343.github.io/firebase.html#realtime-database) for details.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Instructions
In this exercise, we'll build an authentication system for a React application. Before getting started, make sure that:

1. You have your account set up on Firebase ([instructions](https://info343.github.io/firebase.html#setting-up-firebase)).

2. You [create a new project](https://info343.github.io/firebase.html#creating-a-project) for this exercise.

### Set up
In your `src/index.js` file, do the following:

1. Import necessary modules: `firebase` (from `'firebase/app'`), and bootstrap styles (`'bootstrap/dist/css/bootstrap.css'`).

2. **Copy and paste** the configuration object from the Firebase web console for the project and pass the configuration object into the `firebase.initializeApp()` function. Do this _before_ you render your `<App>`.

You are now ready to integrate the app into your application.

### Authentication
To start using Firebase's authentication services, you'll need to use the `onAuthStateChanged()` method. This will watch for changes to the authentication status, and fire a callback function, which is powerful because it will **automatically fire** when you execute the methdos described below. Because this method should only be executed once, you should write it in the `componentDidMount()` method. It should:

1. Check if there is a `firebaseUser` (the name we will give to the callback argument of the function).
2. If there is a user, set the state of the application such that the `user` is equal to the `firebaseUser`. It will also help (for future functionality) to reset the `email`, `password`, and `username` to an empty string (`''`).
3. If there _is not_ a user, set the state of the `user` to `null`. This will happen when the user sets out.
4. We'll save the result of the `onAuthStateChanged()` method to a variable called `this.stopWatchingAuth` that will stop watching for changes in authentication.

### Sign up
We'll start by adding a _sign up_ method that will allow users to sign-up for your application using their email and a password. To do this, we'll need to manipulate our app as follow:

1. Add a method to our app `handleChange()` that will track the state of the `email`, `password`, and `displayName` entered by the user. This event should be fired by each input element of the form, updating the `state` of the application appropriately.
2. Add a method to our app `handleSignUp()` that will:
    -  Use Firebase's `createUserWithEmailAndPassword()` to create a new user using the email and password currently stored in the state. When that method is successful(i.e., in the _callback_)...
    -  It should **set the `displayName` property** of the newly created user (using the `updateProfile` method), _then_,
    - It should change the state of the current user. And,
    - It should `catch` any errors, and update the `errorMessage` property of the application state. This will likely reveal issues that you need to resolve.
3. Assign the `handleSignUp()` method as an event listener to the `Sign Up` button.

You should now be able to create users through your form, catch errors (that are provided by Firebase), and see newly created users on Firebase!

### Sign in
In this section, we'll provide the necessary functionality to enable users (who have already been created) to sign-in. Because of the work we did on set-up, this step is quite straightforward:

1. Add a new `handleSignIn()` method that leverages Firebase's `signInWithEmailAndPassword` method. When this changes, the `onAuthStateChanged()` callback will execute, and should update our state properly.
2. Just in case, make sure to `catch` any errors.
3. Assign the `handleSignIn()` method as an event listener to the `Sign In` button.

### Sign Out
In this section, we'll provide the necessary functionality to enable users (who are logged in) to sign-in.

1. Add a new `handleSignIn()` method that leverages Firebase's `signOut` method. When this changes, the `onAuthStateChanged()` callback will execute, and should update our state properly.
2. Assign the `handleSignOut()` method as an event listener to the `Sign Out` button.

## Part II
Now, let's make our app more interesting / interactive by adding the ability to **add data**. We'll make an app in which we can make music suggestions. To do this, you'll need to [sign up](https://www.spotify.com/us/signup/) for a (free) Spotify account.

### Reorganization
Let's start by moving our current HTML content into a new `<Auth>` component. Importantly, we'll need to continue tracking information in our `<App>` state, so we'll need to **pass methods to the `Auth` Component** such that we can _lift up our state_.

1. Create a new file `Auth.js` in which you **create and export** your `<Auth>` component. The component should **take as props** methods for signing in, singing up, and signing out. This component should **render** the `form` used to authenticate into the application.
2. You should edit the authentication methods in your `<App>` component such that they _take as arugments_ parameters that can be passed in (`email`, `password`, `username`). You'll keep track of those elements in the **state** of your `<Auth>` component. You can now remove these from the state of the App.
3. In order to properly lift up state, you'll need to **bind your methods** in the constructor of your `<App>` component.
4. You should now only show the `<Auth>` object if someone _is not_ signed in. Otherwise, you should show your `Sign Out` button (with the same functionality) as part of your App. Also, remove the `Sign Out` button from the `Auth` object.

### Music Requests
In order to In your App, you'll add a form for a user to input a music request. The form will simply take the HTTPS link to a spotify song. You can access the link by clicking on the `...` to the right of a song, and selecting `Copy Song Link`.

1. Make a form in your App that allows a user to input a song request. This should have an `<input>` element and a `<button>` to add a song. You should track the `songLink` as part of the App's state, and update the `songLink` each time the input is updated (copy the same structure as the previous `email` and `password` elements). You should only show this form if a user is logged in.

2. When the `<button>` is clicked, you'll want to add the Spotify URL to our data structure on Firebase. To do this, you'll need to make the following changes:
- When the `<App>` mounts, set a **database reference** to the `requests/` object in our Firebase datastore. You should store this reference in `this.requestRef` for later. Then, set a Firebase event listener on `this.requestRef` that, when there are changes to the reference, the App's state (`state.requests`) will update.
- Write an event handler `addRequest()` for the `button` that will **add a new requests** to our `requests` reference. It should push in a new object that has the following properties:
    - `songLink`: the `songLink` put into the `<input>` element, stored in `this.state.songLink` (of the App)
    - `user`: the currently logged in user's display name `this.state.user.displayName`
    - `timestamp`: the time at which the request was made (`firebase.database.ServerValue.TIMESTAMP`)
    - `likes`: the number of times people have liked this song (`0`).

3. Add a new file `RequestList.js` that creates and exports a new `<RequestList>` component. The component should take as `props` an _array of songs_ (prepared in step 5 below), and for each one, render a `<MusicItem>` element (see next step).

4. Add a new file `MusicItem.js` that creates and exports a new `<MusicItem>` component. This component should take as props `info`, an object that holds the song item (with URL, user, and likes). For testing, have this element render a `<div>` with some text in it (we'll return to this below).

5. In your `render` method of your app, you should create an array of requests from `this.state.reqeusts`. See the last paragraph of this [book chapter](https://info343.github.io/firebase.html#realtime-database). Pass this set of requests to the `<RequestList>` component

6. Now let's edit the `MusicItem` render method to return something more useful. This component should render a few elements inside it's `render()` method:

- An `<iframe>` to show the song element from Spotify.
    <iframe src={"https://open.spotify.com/embed?uri=" + this.props.info.songLink} width="300" height="380" frameBorder="0" allowtransparency="true"></iframe>
- The `displayName` of the user who reqeusted the song
- The number of `likes` received

7. Here's the tricky part -- we want a user to be able to like a song (not as tricky as it sounds). So, when someone clicks on the `likes` text, we want to change the data stored on Firebase (which will in turn, change the state of the App). This, nicely, allows us to get around lifting up our state. However, we'll need to **create a reference** to the song in the `MusicItem` app. To do this, we'll need to register a **transaction** on our item.

8. Add some cool styles to make it look and feel great, and enjoy!

## Part III: React Router
In the final stage of this project, we'll transform our application into a multipage application using React Router. We'll draw on the [basic example](https://reacttraining.com/react-router/web/example/basic), as well as [this tutorial](https://tylermcginnis.com/react-router-protected-routes-authentication/), but we'll make something a little simpler.

The intended structure of our Application is:

```js
{/* Our application that gets rendered */}
<App>
    {/* Create a router element to handle route changing */}
    <Router>

        {/* Clickable links to different routes (pages) */}
        <Link to="/">Home</Link>
        <Link to="/my-songs">My Songs</Link>
        <Link to="/data-tool">Explore Data</Link>

        {/* Routes describe components to render at each path */}
        <Route exact path="/" component={HomePage}/>
        <Route path="/auth" component={Auth}/>
        <Route path="/my-songs" component={MySongs}/>
        <Route path="/data-tool" component={DataTool}/>
    </Router>
</App>
```

This will require the following (broad) steps:

1. Move the current `<App>` content (form + `RequestList`) to a (new) `<HomePage>` component.
2. Move the authentication `SignIn` and `SignUp` functions (back) into the `<Auth>` component. We'll keep the `SignOut` button in the `<App>`.
3. Create a `NavBar` using [this example](https://reactstrap.github.io/components/navbar/).
3. Create the above links/routes in our `<App>` component.
4. Add redirects such that, if someone is logged in, they are redirected to the `HomePage` Route. Similarly, if someone is not logged in on your `<Homepage>`, they should be redicrected to the `Auth` route.
5. Add a new Component `<DataTool>` to explore the data from our users.
6. Make sure to stop listening to database changes when the components **unmount**.
