import * as React from 'react'
import { ComponentClass } from 'react'
import { connect } from 'react-redux'
import {
  GenerateRequireSignInWrapperConfig,
  ReduxState,
  RequireSignInWrapper,
} from './types'

const generateRequireSignInWrapper = (
  { redirectPathIfNotSignedIn }: GenerateRequireSignInWrapperConfig
): RequireSignInWrapper => {
  const requireSignInWrapper = (PageComponent: ComponentClass): ComponentClass => {
    interface WrapperProps {
      readonly isSignedIn: boolean
      readonly hasVerificationBeenAttempted: boolean
      readonly history: {
        readonly replace: (path: string) => void
      }
    }

    class GatedPage extends React.Component<WrapperProps> {
      public componentWillMount (): void {
        const {
          history,
          isSignedIn,
          hasVerificationBeenAttempted
        } = this.props
        if (!isSignedIn && hasVerificationBeenAttempted) {
          history.replace(redirectPathIfNotSignedIn)
        }
      }

      public render (): JSX.Element {
        return <PageComponent {...this.props} />
      }
    }

    const mapStateToProps = (state: ReduxState) => ({
      isSignedIn: state.reduxTokenAuth.currentUser.isSignedIn,
      hasVerificationBeenAttempted: state.reduxTokenAuth.currentUser.hasVerificationBeenAttempted
    })

    return connect(
      mapStateToProps,
    )(GatedPage)
  }

  return requireSignInWrapper
}

export default generateRequireSignInWrapper
