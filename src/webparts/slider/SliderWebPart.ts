import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { ClientMode } from './components/ClientMode';
import * as strings from 'SliderWebPartStrings';
import Slider from './components/Slider';
import { ISliderProps } from './components/ISliderProps';

export interface ISliderWebPartProps {
  description: string;
  Color: string;
  siteUrl : string;
  clientMode: ClientMode;
}

export default class SliderWebPart extends BaseClientSideWebPart <ISliderWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISliderProps> = React.createElement(
      Slider,
      {
        description: this.properties.description,
        Color: this.properties.Color,
        siteUrl :this.context.pageContext.web.absoluteUrl,
        clientMode: this.properties.clientMode,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('Color', {
                  label: 'Color'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
